-- ============================================================
-- Migration 003: Seed Data
-- Run AFTER creating the Supabase Auth user manually
-- ============================================================

-- Step 1: Create admin user in Supabase Auth Dashboard or via API
-- Email: yashu22@clinic.internal
-- Password: $Soham2005
-- Then copy the UUID and replace 'ADMIN_USER_UUID_HERE' below

-- Step 2: Insert admin profile (replace UUID)
-- INSERT INTO public.profiles (id, username, role, subscription_end)
-- VALUES ('ADMIN_USER_UUID_HERE', 'yashu22', 'admin', '2099-12-31');

-- Step 3: Insert default clinic settings for admin
-- INSERT INTO public.clinic_settings (user_id, clinic_name, doctor_name, reg_number, phone, email, address, city, state, pin)
-- VALUES ('ADMIN_USER_UUID_HERE', 'City Medical Clinic', 'Dr. Yashu', 'MH-2024-001', '+91 98765 43210', 'clinic@example.com', '123 Health Street', 'Mumbai', 'Maharashtra', '400001');

-- ============================================================
-- Sample medicines (global, user_id = NULL)
-- ============================================================
INSERT INTO public.medicines (medicine_name, strength, dosage_form, manufacturer, is_custom, user_id)
VALUES
  ('Paracetamol', '500mg', 'Tablet', 'Generic', false, NULL),
  ('Paracetamol', '650mg', 'Tablet', 'Crocin', false, NULL),
  ('Ibuprofen', '400mg', 'Tablet', 'Generic', false, NULL),
  ('Amoxicillin', '500mg', 'Capsule', 'Generic', false, NULL),
  ('Azithromycin', '500mg', 'Tablet', 'Zithromax', false, NULL),
  ('Metformin', '500mg', 'Tablet', 'Generic', false, NULL),
  ('Omeprazole', '20mg', 'Capsule', 'Generic', false, NULL),
  ('Atorvastatin', '10mg', 'Tablet', 'Generic', false, NULL),
  ('Amlodipine', '5mg', 'Tablet', 'Generic', false, NULL),
  ('Cetirizine', '10mg', 'Tablet', 'Generic', false, NULL),
  ('Pantoprazole', '40mg', 'Tablet', 'Generic', false, NULL),
  ('Doxycycline', '100mg', 'Capsule', 'Generic', false, NULL),
  ('Metronidazole', '400mg', 'Tablet', 'Generic', false, NULL),
  ('Ranitidine', '150mg', 'Tablet', 'Generic', false, NULL),
  ('Domperidone', '10mg', 'Tablet', 'Generic', false, NULL),
  ('Ondansetron', '4mg', 'Tablet', 'Generic', false, NULL),
  ('Levocetirizine', '5mg', 'Tablet', 'Generic', false, NULL),
  ('Montelukast', '10mg', 'Tablet', 'Generic', false, NULL),
  ('Salbutamol', '2mg', 'Tablet', 'Generic', false, NULL),
  ('Prednisolone', '5mg', 'Tablet', 'Generic', false, NULL)
ON CONFLICT DO NOTHING;
