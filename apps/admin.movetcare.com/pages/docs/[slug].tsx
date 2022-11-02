import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Container from 'components/docs/Container';
import { getDocBySlug, getAllDocs } from 'utils/docs';
import Head from 'next/head';
import markdownToHtml from 'utils/markdownToHtml';

export default function Doc({ doc }: any) {
  const router = useRouter();
  if (!router.isFallback && !doc?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Container>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <article>
            <Head>
              <title>MoVET | Docs - {doc.title}</title>
            </Head>
            <h1>{doc.title}</h1>
            <div className="max-w-2xl mx-auto">
              <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
          </article>
        </>
      )}
    </Container>
  );
}

export async function getStaticProps({ params }: any) {
  const doc: any = getDocBySlug(params.slug, ['title', 'slug', 'content']);
  const content = await markdownToHtml(doc.content || '');

  return {
    props: {
      doc: {
        ...doc,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const docs = getAllDocs(['slug']);

  return {
    paths: docs.map((doc: any) => {
      return {
        params: {
          slug: doc.slug,
        },
      };
    }),
    fallback: false,
  };
}
