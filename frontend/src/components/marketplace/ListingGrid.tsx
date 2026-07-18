interface ListingGridProps {
  children: React.ReactNode;
}

export default function ListingGrid({ children }: ListingGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
