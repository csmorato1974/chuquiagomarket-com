import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const StaticPage = ({ title, description, children }: Props) => (
  <Layout>
    <Helmet>
      <title>{title} — Chuquiago Market</title>
      <meta name="description" content={description} />
    </Helmet>
    <div className="container-market py-8 md:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: title }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <div className="prose prose-sm md:prose-base max-w-none text-foreground space-y-4">
        {children}
      </div>
    </div>
  </Layout>
);

export default StaticPage;
