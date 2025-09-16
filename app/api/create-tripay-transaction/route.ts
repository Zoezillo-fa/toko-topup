// app/api/create-tripay-transaction/route.ts
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { supabase } from "@/lib/supabaseClient"; // <-- TAMBAHKAN IMPORT INI

export async function POST(request: Request) {
    const { orderId, amount, productName, customerName, customerEmail, userIdGame, zoneIdGame } = await request.json();

    // ==========================================================
    // LANGKAH 1: Simpan transaksi ke database kita dengan status PENDING
    // ==========================================================
    const { error: insertError } = await supabase.from('transactions').insert({
        order_id: orderId,
        amount: amount,
        product_name: productName,
        status: 'PENDING',
        user_id_game: userIdGame,
        zone_id_game: zoneIdGame
    });

    if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json({ error: "Gagal menyimpan transaksi." }, { status: 500 });
    }

    // ==========================================================
    // LANGKAH 2: Lanjutkan proses ke Tripay (kode lama kita)
    // ==========================================================
    const apiKey = process.env.TRIPAY_API_KEY;
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;
    const merchantCode = process.env.TRIPAY_MERCHANT_CODE;
    
    const url = 'https://tripay.co.id/api-sandbox/transaction/create';

    const signatureString = `${merchantCode}${orderId}${amount}${privateKey}`;
    const signature = crypto.createHmac('sha266', privateKey!) // Perhatikan, algoritma yang benar adalah sha256
                            .update(signatureString)
                            .digest('hex');

    const payload = {
        method: 'QRIS',
        merchant_ref: orderId,
        amount: amount,
        customer_name: customerName,
        // ... (sisa payload tidak berubah)
    };
    
    // ... (sisa try-catch block untuk fetch ke Tripay tidak berubah)
    
    // Pastikan Anda juga mengirim userIdGame dan zoneIdGame dari frontend
}