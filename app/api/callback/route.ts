// app/api/callback/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;

    // 1. Validasi Keamanan dengan Signature
    const receivedSignature = request.headers.get('x-callback-signature');
    const requestBody = await request.json();

    const signature = crypto.createHmac('sha256', privateKey!)
                            .update(JSON.stringify(requestBody))
                            .digest('hex');

    if (receivedSignature !== signature) {
        return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 401 });
    }

    // 2. Jika Signature valid, proses data callback
    const { merchant_ref, status, reference } = requestBody;

    if (status === 'PAID') {
        // 3. Update status transaksi di database kita menjadi PAID
        const { data, error } = await supabase
            .from('transactions')
            .update({ status: 'PAID', payment_provider_ref: reference })
            .eq('order_id', merchant_ref)
            .select();

        if (error) {
            console.error('Supabase update error:', error);
            // Meskipun gagal update, tetap kirim response sukses ke Tripay agar tidak di-retry
            return NextResponse.json({ success: false, message: 'Failed to update transaction status' }, { status: 500 });
        }

        console.log(`Transaction ${merchant_ref} successfully updated to PAID.`);
        // Di sini Anda bisa menambahkan logika lain, seperti mengirim notifikasi ke pengguna
    }
    
    // 4. Kirim response sukses ke Tripay
    return NextResponse.json({ success: true });
}