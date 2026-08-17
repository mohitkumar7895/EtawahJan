import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PortfolioProject from '@/models/PortfolioProject';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const projects = await PortfolioProject.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, category, photoUrl, videoUrl, liveUrl, isActive } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const newProject = await PortfolioProject.create({
      title,
      description,
      category,
      photoUrl,
      videoUrl,
      liveUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
