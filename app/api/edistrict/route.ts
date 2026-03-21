import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError, jsonDoc, parsePagination } from '@/lib/janSevaApiHelpers';
import Edistrict from '@/models/Edistrict';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [items, total] = await Promise.all([
      Edistrict.find().sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Edistrict.countDocuments(),
    ]);

    return NextResponse.json({
      data: items.map((d) => ({ ...d, id: String(d._id) })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/edistrict');
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      date,
      subject,
      certificateNumber,
      name,
      mobile,
      address,
      amount,
      jama,
      baki,
    } = body;

    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const amt = Number(amount) || 0;
    const j = Number(jama) || 0;
    const bk = Number(baki) || 0;

    const doc = new Edistrict({
      date: new Date(date),
      subject: subject.trim(),
      certificateNumber: certificateNumber != null ? String(certificateNumber).trim() : '',
      name: name.trim(),
      mobile: mobile != null ? String(mobile) : '',
      address: address != null ? String(address) : '',
      amount: amt,
      jama: j,
      baki: bk,
    });

    const saved = await doc.save();
    return NextResponse.json(jsonDoc(saved), { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/edistrict');
  }
}
