import type { SVGProps } from "react";

/** 最小限のアウトラインアイコン (Heroicons のパスを使用) */
function Icon({ d, ...props }: SVGProps<SVGSVGElement> & { d: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export function MagnifyingGlassIcon(props: SVGProps<SVGSVGElement>) {
  return <Icon d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" {...props} />;
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return <Icon strokeWidth={2} d="m19.5 8.25-7.5 7.5-7.5-7.5" {...props} />;
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return <Icon strokeWidth={2} d="M15.75 19.5 8.25 12l7.5-7.5" {...props} />;
}

export function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h1.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
      {...props}
    />
  );
}

export function TrayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon
      d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
      {...props}
    />
  );
}

export function ArrowTopRightOnSquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      {...props}
    />
  );
}
