// app/api/get-game/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Game slug is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('games')
    .select(`name, image_url, description, products(id, name, price)`)
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    console.error('Supabase error:', error); // Tambahkan log ini untuk debugging
    return NextResponse.json({ error: 'Game not found in database' }, { status: 404 });
  }

  return NextResponse.json(data);
}