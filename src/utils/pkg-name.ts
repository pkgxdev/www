export default function get_name(project: string): string {
  if (project.startsWith("sourceforge.net")) {
    return 'sf.net' + project.slice(15);
  } else {
    return project
  }
}
