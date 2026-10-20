/** Повертає HTML-розмітку скелетона картки (loading state). */
export function skeletonCardHtml(): string {
  return `
    <li class="card card--skeleton" aria-hidden="true">
      <span class="skeleton skeleton--avatar"></span>
      <span class="skeleton skeleton--line skeleton--line--wide"></span>
      <span class="skeleton skeleton--line skeleton--line--short"></span>
      <span class="skeleton__chips">
        <span class="skeleton skeleton--chip"></span>
        <span class="skeleton skeleton--chip"></span>
      </span>
    </li>
  `;
}
