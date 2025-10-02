import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get form data
  const formData = await request.formData()
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  // Check if user already has an organization
  const { data: existingOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingOrg) {
    return NextResponse.redirect(new URL('/organizations?error=already_exists', request.url))
  }

  // Create organization
  const { error: insertError } = await supabase
    .from('organizations')
    .insert({
      user_id: user.id,
      name,
      description,
    })

  if (insertError) {
    return NextResponse.redirect(new URL('/organizations?error=creation_failed', request.url))
  }

  // Revalidate the organizations page
  revalidatePath('/organizations')
  
  return NextResponse.redirect(new URL('/organizations', request.url))
}