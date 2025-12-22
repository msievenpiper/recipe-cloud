import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';

const dbRun = promisify(db.run.bind(db));

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await dbRun('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    return new NextResponse('Email already exists', { status: 400 });
  }
}
