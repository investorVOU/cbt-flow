
-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.students (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    student_id TEXT UNIQUE,
    phone TEXT,
    course TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    biometric_data TEXT,
    face_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Drop existing attendance table if it exists and recreate with proper schema
DROP TABLE IF EXISTS public.attendance;

CREATE TABLE public.attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES public.students(id),
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'present',
    method TEXT NOT NULL DEFAULT 'manual',
    location TEXT,
    ip_address TEXT,
    device_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id SERIAL PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Users can view all students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Users can insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update students" ON public.students FOR UPDATE USING (true);

-- Create policies for attendance table
CREATE POLICY "Users can view all attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Users can insert attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update attendance" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Users can delete attendance" ON public.attendance FOR DELETE USING (true);

-- Create policies for admin_logs table
CREATE POLICY "Users can view admin logs" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert admin logs" ON public.admin_logs FOR INSERT WITH CHECK (true);
