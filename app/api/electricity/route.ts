import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError, parsePagination } from '@/lib/janSevaApiHelpers';
import { serializeElectricity } from '@/lib/electricitySerialize';
import Electricity from '@/models/Electricity';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [items, total] = await Promise.all([
      Electricity.find().sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Electricity.countDocuments(),
    ]);

    return NextResponse.json({
      data: items.map((d) => ({ ...d, id: String(d._id) })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/electricity');
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, name, password, amount, baki, address, contact } = body;
    const consumerId = body.consumerId ?? body.id;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!consumerId?.trim()) {
      return NextResponse.json({ error: 'Consumer ID is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const doc = new Electricity({
      date: new Date(date),
      name: name.trim(),
      id: String(consumerId).trim(),
      password: password != null ? String(password) : '',
      amount: Number(amount) || 0,
      baki: Number(baki) || 0,
      address: address != null ? String(address) : '',
      contact: contact != null ? String(contact) : '',
    });

    const saved = await doc.save();
    return NextResponse.json(serializeElectricity(saved), { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/electricity');
  }
}
