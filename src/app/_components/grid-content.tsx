const GridContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-1 flex-col gap-4 p-12">{children}</div>;
};

export default GridContent;
