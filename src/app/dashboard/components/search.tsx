import { Input } from "@/components/ui/input";

type SearchProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export function Search({ searchTerm, setSearchTerm }: SearchProps) {
    return (
        <div>
            <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-[100px] lg:w-[300px]"
            />
        </div>
    );
}
