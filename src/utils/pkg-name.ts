export default function get_name(project: string): string {
  if (project.startsWith("sourceforge.net")) {
    return 'sf.net' + project.slice(15);
  } else {
    const match = project.match(/^(.*)\.github.io\/(.*)/)
    if (match) {
      return match[1] == match[2] ? match[1] : `@${match[1]}/${match[2]}`;
    } else {
      const match = project.match(/^github.com\/(.*)\/(.*)/)
      if (match) {
        return match[1] == match[2] ? match[1] : `@${match[1]}/${match[2]}`;
      } else {
        return project
      }
    }
  }
}
