import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import type { WorkProject } from './types';

const FILE = localJsonFilePath('work.json');
const SELECT = 'id, title, category, client, description, image';

export async function getWorkProjects(): Promise<WorkProject[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_projects')
      .select(SELECT)
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  return readLocalJson<WorkProject>(FILE).sort((a, b) =>
    a.id < b.id ? 1 : -1
  );
}

export async function addWorkProject(
  project: Omit<WorkProject, 'id'>
): Promise<WorkProject> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_projects')
      .insert({
        title: project.title,
        category: project.category,
        client: project.client,
        description: project.description,
        image: project.image,
      })
      .select(SELECT)
      .single();

    if (error) throw error;
    return data;
  }

  const projects = readLocalJson<WorkProject>(FILE);
  const next: WorkProject = { ...project, id: Date.now().toString() };
  projects.unshift(next);
  writeLocalJson(FILE, projects);
  return next;
}

export async function deleteWorkProject(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('work_projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const projects = readLocalJson<WorkProject>(FILE);
  writeLocalJson(FILE, projects.filter((p) => p.id !== id));
}