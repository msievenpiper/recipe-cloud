import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { promisify } from 'util';

const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const recipe = await dbGet('SELECT * FROM recipes WHERE id = ?', [params.id]);
  return NextResponse.json(recipe);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name, instructions, notes } = await request.json();
  await dbRun('UPDATE recipes SET name = ?, instructions = ?, notes = ? WHERE id = ?', [name, instructions, notes, params.id]);
  return new NextResponse(null, { status: 204 });
}
