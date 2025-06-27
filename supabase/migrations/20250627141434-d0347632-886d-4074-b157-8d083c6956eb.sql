
-- Sizin istifadəçi ID-nizi admin kimi təyin edək
INSERT INTO public.user_roles (user_id, role) 
VALUES ('af0f0d9f-12fb-43d3-b649-ba8dc2a92415', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Yoxlayaq ki, rol düzgün təyin olunub
SELECT ur.*, p.email, p.full_name 
FROM public.user_roles ur
JOIN public.profiles p ON ur.user_id = p.id
WHERE ur.user_id = 'af0f0d9f-12fb-43d3-b649-ba8dc2a92415';
