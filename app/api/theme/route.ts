import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Theme from '@/models/Theme';

export async function GET() {
  try {
    await connectDB();
    let theme = await Theme.findOne({});
    if (!theme) {
      theme = await Theme.create({ primaryColorName: 'blue' });
    }
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { primaryColorName } = await request.json();
    
    if (!primaryColorName) {
      return NextResponse.json({ success: false, error: 'primaryColorName is required' }, { status: 400 });
    }

    await connectDB();
    
    let theme = await Theme.findOne({});
    if (theme) {
      theme.primaryColorName = primaryColorName;
      await theme.save();
    } else {
      theme = await Theme.create({ primaryColorName });
    }

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ success: false, error: 'Failed to update theme' }, { status: 500 });
  }
}
