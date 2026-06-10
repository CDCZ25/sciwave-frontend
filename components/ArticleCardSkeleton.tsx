export default function ArticleCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="w-full h-44 bg-slate-800 animate-pulse" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-full bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
