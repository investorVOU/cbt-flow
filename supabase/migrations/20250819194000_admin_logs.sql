-- Create admin_logs table for tracking administrative actions
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_logs (allow all for now, in production restrict to admin role)
CREATE POLICY "Allow all access to admin_logs for testing" 
ON public.admin_logs 
FOR ALL 
USING (true);

-- Create index on created_at for better performance
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- Create index on admin_email for filtering
CREATE INDEX idx_admin_logs_admin_email ON public.admin_logs(admin_email);