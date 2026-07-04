-- has_role is used inside RLS policies. Policies run with the privileges of the
-- policy owner (postgres), so authenticated users do not need direct EXECUTE.
-- Revoking it removes the linter warning without changing policy behavior.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
