import { asset, formatDate, updates } from '../content';
import { UpdateCard } from './Home';
import { Arrow, Label, Title } from './ui';

export function UpdatesIndex() {
  return (
    <main className="page">
      <section className="page-head">
        <Label index="06">Updates</Label>
        <Title as="h1" text="From the" accent="workshop." />
        <p className="lede">News and progress from VyuhaAero Systems. We publish what we can stand behind, as our work matures.</p>
      </section>
      <section className="updates updates-all">
        {updates.length === 0
          ? <p className="lede">No updates yet.</p>
          : <div className="update-grid">{updates.map((u, i) => <UpdateCard key={u.slug} u={u} delay={(i % 3) * 90} />)}</div>}
      </section>
    </main>
  );
}

export function UpdatePost({ slug }: { slug: string }) {
  const index = updates.findIndex(u => u.slug === slug);
  const u = updates[index];
  if (!u) {
    return (
      <main className="page">
        <section className="page-head">
          <Label index="404">Not found</Label>
          <Title as="h1" text="Signal lost." />
          <a className="btn btn-ghost" href="#/updates">All updates<Arrow /></a>
        </section>
      </main>
    );
  }
  const next = updates[index + 1];
  return (
    <main className="page">
      <article className="post">
        <a className="post-back" href="#/updates">← ALL UPDATES</a>
        <div className="update-meta"><span>{u.category}</span><span>{formatDate(u.date)}</span></div>
        <h1 className="post-title">{u.title}</h1>
        {u.summary && <p className="post-summary">{u.summary}</p>}
        {u.cover && <img className="post-cover" src={asset(u.cover)} alt="" />}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: u.html }} />
        {next && (
          <a className="post-next" href={`#/updates/${next.slug}`}>
            <span>NEXT UPDATE</span>
            <strong>{next.title}<Arrow /></strong>
          </a>
        )}
      </article>
    </main>
  );
}
