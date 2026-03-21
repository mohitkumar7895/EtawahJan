import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError, jsonDoc, parsePagination } from '@/lib/janSevaApiHelpers';
import Withdrawal from '@/models/Withdrawal';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [items, total] = await Promise.all([
      Withdrawal.find().sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Withdrawal.countDocuments(),
    ]);

    return NextResponse.json({
      data: items.map((d) => ({ ...d, id: String(d._id) })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/withdrawal');
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      date,
      aadharNumber,
      name,
      withdrawal,
      remains,
      signature,
      mobileNumber,
    } = body;

    if (!aadharNumber?.trim()) {
      return NextResponse.json({ error: 'Aadhar number is required' }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const withdrawalStr = withdrawal != null ? String(withdrawal) : '';
    const rm = Number(remains) || 0;

    const doc = new Withdrawal({
      date: new Date(date),
      aadharNumber: aadharNumber.trim(),
      name: name.trim(),
      withdrawal: withdrawalStr,
      remains: rm,
      signature: signature != null ? String(signature) : '',
      mobileNumber: mobileNumber != null ? String(mobileNumber) : '',
    });

    const saved = await doc.save();
    return NextResponse.json(jsonDoc(saved), { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/withdrawal');
  }
}
