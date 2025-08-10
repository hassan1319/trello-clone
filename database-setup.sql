-- Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lists table
CREATE TABLE IF NOT EXISTS public.lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for boards
CREATE POLICY "Users can view own boards" ON public.boards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards" ON public.boards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards" ON public.boards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards" ON public.boards
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for lists
CREATE POLICY "Users can view lists from own boards" ON public.lists
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create lists in own boards" ON public.lists
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update lists in own boards" ON public.lists
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete lists in own boards" ON public.lists
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks from own boards" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks in own boards" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks in own boards" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks in own boards" ON public.tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON public.boards(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON public.lists(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON public.tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_lists_position ON public.lists(board_id, position);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON public.tasks(list_id, position);