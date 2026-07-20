import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <div className="w-[1440px] h-[59px] flex justify-around items-center mx-auto">
      <Link href="/">
        <Image
          src="/header/logo.svg"
          alt="logo"
          width={92}
          height={20}
          className="w-[92px] h-[20px] cursor-pointer"
        />
      </Link>
      <div className="flex gap-[12px]">
        <Button
          variant={"outline"}
          className="rounded-lg w-[97px] h-[36px] items-center gap-[10px] flex"
        >
          <Image
            src="/header/chevron-down.svg"
            alt="checron"
            width={10}
            height={10}
            className="w-[16px] h-[16px]"
          />
          <p>Genre</p>
        </Button>
        <InputGroup className="max-w-xs rounded-lg">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Image
        src="/header/Icon-Button.svg"
        alt="icon"
        width={36}
        height={36}
        className="w-[36px] h-[36px] cursor-pointer"
      />
    </div>
  );
}
