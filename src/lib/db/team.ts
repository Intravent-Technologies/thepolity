import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import type { TeamMember } from './types';

const FILE = localJsonFilePath('team.json');
const SELECT = 'id, name, role, bio, image';

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('team_members')
      .select(SELECT)
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  return readLocalJson<TeamMember>(FILE).sort((a, b) =>
    a.id < b.id ? 1 : -1
  );
}

export async function addTeamMember(
  member: Omit<TeamMember, 'id'>
): Promise<TeamMember> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('team_members')
      .insert({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
      })
      .select(SELECT)
      .single();

    if (error) throw error;
    return data;
  }

  const members = readLocalJson<TeamMember>(FILE);
  const next: TeamMember = { ...member, id: Date.now().toString() };
  members.unshift(next);
  writeLocalJson(FILE, members);
  return next;
}

export async function deleteTeamMember(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const members = readLocalJson<TeamMember>(FILE);
  writeLocalJson(FILE, members.filter((m) => m.id !== id));
}