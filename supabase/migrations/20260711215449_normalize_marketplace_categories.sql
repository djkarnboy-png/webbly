alter table public.templates
drop constraint if exists templates_category_check;

update public.templates
set category = case category
  when 'Cafes' then 'Cafes & Bakeries'
  when 'Salons' then 'Beauty & Care'
  when 'Gyms' then 'Fitness'
  when 'Tutors' then 'Education'
  when 'Agencies' then 'Agencies & Services'
  else category
end
where category in ('Cafes', 'Salons', 'Gyms', 'Tutors', 'Agencies');

alter table public.templates
add constraint templates_category_check check (
  category in (
    'Restaurants',
    'Cafes & Bakeries',
    'Beauty & Care',
    'Fitness',
    'Education',
    'Online Stores',
    'Agencies & Services',
    'Real Estate'
  )
);
