import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError, jsonDoc } from '@/lib/janSevaApiHelpers';
import Edistrict from '@/models/Edistrict';
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
    const doc = await Edistrict.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(jsonDoc(doc));
  } catch (error) {
    return handleApiError(error, 'GET /api/edistrict/[id]');
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

    const doc = await Edistrict.findByIdAndUpdate(
      id,
      {
        date: new Date(date),
        subject: subject.trim(),
        certificateNumber: certificateNumber != null ? String(certificateNumber).trim() : '',
        name: name.trim(),
        mobile: mobile != null ? String(mobile) : '',
        address: address != null ? String(address) : '',
        amount: amt,
        jama: j,
        baki: bk,
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(jsonDoc(doc));
  } catch (error) {
    return handleApiError(error, 'PUT /api/edistrict/[id]');
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
    const doc = await Edistrict.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/edistrict/[id]');
  }
}
