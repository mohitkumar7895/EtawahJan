import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError } from '@/lib/janSevaApiHelpers';
import { serializeElectricity } from '@/lib/electricitySerialize';
import Electricity from '@/models/Electricity';
import mongoose from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const doc = await Electricity.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(serializeElectricity(doc));
  } catch (error) {
    return handleApiError(error, 'GET /api/electricity/[id]');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

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

    const doc = await Electricity.findByIdAndUpdate(
      id,
      {
        date: new Date(date),
        name: name.trim(),
        id: String(consumerId).trim(),
        password: password != null ? String(password) : '',
        amount: Number(amount) || 0,
        baki: Number(baki) || 0,
        address: address != null ? String(address) : '',
        contact: contact != null ? String(contact) : '',
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(serializeElectricity(doc));
  } catch (error) {
    return handleApiError(error, 'PUT /api/electricity/[id]');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const doc = await Electricity.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/electricity/[id]');
  }
}
