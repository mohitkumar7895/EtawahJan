import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError, jsonDoc } from '@/lib/janSevaApiHelpers';
import Withdrawal from '@/models/Withdrawal';
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
    const doc = await Withdrawal.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(jsonDoc(doc));
  } catch (error) {
    return handleApiError(error, 'GET /api/withdrawal/[id]');
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

    const doc = await Withdrawal.findByIdAndUpdate(
      id,
      {
        $set: {
          date: new Date(date),
          aadharNumber: aadharNumber.trim(),
          name: name.trim(),
          withdrawal: withdrawalStr,
          remains: rm,
          signature: signature != null ? String(signature) : '',
          mobileNumber: mobileNumber != null ? String(mobileNumber) : '',
        },
        $unset: { amount: '' },
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(jsonDoc(doc));
  } catch (error) {
    return handleApiError(error, 'PUT /api/withdrawal/[id]');
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
    const doc = await Withdrawal.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/withdrawal/[id]');
  }
}
