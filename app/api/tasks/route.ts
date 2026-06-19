import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type TaskRow, mapTaskRowToTodo, mapTodoToTaskRow } from '@/types/task'
import type { Todo } from '@/types/Todo'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/tasks] No accessible event')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/tasks] ${error.message ?? 'Failed to fetch tasks'}`)
      return internalServerError(error.message ?? 'Failed to fetch tasks')
    }

    const todos = (data ?? []).map((row) => mapTaskRowToTodo(row as TaskRow))
    Logger.info('[GET /api/tasks] Tasks fetched successfully', ctx.userId)
    return NextResponse.json(todos)
  } catch (error) {
    Logger.error(`[GET /api/tasks] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[POST /api/tasks] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: ctx.userId,
      event_id: ctx.eventId,
      ...mapTodoToTaskRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('tasks').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/tasks] ${error.message ?? 'Failed to create task'}`)
      return internalServerError(error.message ?? 'Failed to create task')
    }

    const todo = mapTaskRowToTodo(data as TaskRow)
    Logger.info('[POST /api/tasks] Task created successfully', ctx.userId)
    return NextResponse.json(todo)
  } catch (error) {
    Logger.error(`[POST /api/tasks] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[PUT /api/tasks] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Todo>(request)
    if (!body || body.id == null) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const updates = {
      ...mapTodoToTaskRow(body),
      user_id: ctx.userId,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', body.id)
      .eq('event_id', ctx.eventId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/tasks] ${error.message ?? 'Failed to update task'}`)
      return internalServerError(error.message ?? 'Failed to update task')
    }
    if (!data) {
      return notFound('Task not found')
    }

    const todo = mapTaskRowToTodo(data as TaskRow)
    Logger.info('[PUT /api/tasks] Task updated successfully', ctx.userId)
    return NextResponse.json(todo)
  } catch (error) {
    Logger.error(`[PUT /api/tasks] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/tasks] No accessible event')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    let id: number | null = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      const body = await parseBody<{ id: number }>(request)
      id = body?.id ?? null
    }
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/tasks] ${error.message ?? 'Failed to delete task'}`)
      return internalServerError(error.message ?? 'Failed to delete task')
    }

    Logger.info('[DELETE /api/tasks] Task deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/tasks] ${error as string}`)
    return internalServerError(error as string)
  }
}
