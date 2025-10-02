import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected agent console routes
  const agentRouteMatch = request.nextUrl.pathname.match(
    /^\/organizations\/([^/]+)\/agents\/([^/]+)/
  )

  if (agentRouteMatch) {
    const [, orgId, agentId] = agentRouteMatch

    // Must be authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Verify ownership and subscription
    const { data: agent } = await supabase
      .from('agents')
      .select('id, org_id')
      .eq('id', agentId)
      .eq('org_id', orgId)
      .single()

    if (!agent) {
      return NextResponse.redirect(
        new URL(`/organizations/${orgId}/workforce`, request.url)
      )
    }

    // Verify organization ownership
    const { data: org } = await supabase
      .from('organizations')
      .select('user_id')
      .eq('id', orgId)
      .single()

    if (!org || org.user_id !== user.id) {
      return NextResponse.redirect(new URL('/organizations', request.url))
    }

    // Check subscription status
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(1)

    const subscription = subscriptions?.[0]

    if (!subscription) {
      return NextResponse.redirect(
        new URL(`/organizations/${orgId}/billing?agent=${agentId}`, request.url)
      )
    }

    // Check if subscription is active
    const now = new Date()
    let isActive = false

    if (subscription.status === 'trial' && subscription.trial_expires_at) {
      isActive = new Date(subscription.trial_expires_at) > now
    } else if (subscription.status === 'active' && subscription.subscription_expires_at) {
      isActive = new Date(subscription.subscription_expires_at) > now
    }

    if (!isActive) {
      return NextResponse.redirect(
        new URL(`/organizations/${orgId}/billing?agent=${agentId}`, request.url)
      )
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}