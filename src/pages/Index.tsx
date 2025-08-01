import React, { Suspense } from 'react';

const HTMLDinamico = React.lazy(() => 
  import('@/components/HTMLDinamico').then(module => ({ 
    default: module.HTMLDinamico 
  })).catch(error => {
    console.error('Error loading HTMLDinamico:', error);
    throw error;
  })
);

const Index = () => {
  console.log('Index component loading with lazy loading...');
  return (
    <Suspense fallback={
      <div className="p-8">
        <h1 className="text-2xl font-bold">Carregando HTMLDinâmico...</h1>
        <p>Por favor aguarde...</p>
      </div>
    }>
      <HTMLDinamico />
    </Suspense>
  );
};

export default Index;
