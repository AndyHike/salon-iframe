'use client';

import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import type { CmsItem } from '../../cms/types';
import { serviceBookingHref } from '../../lib/routes';

type ServiceRequestActionProps = {
  service: CmsItem;
  label: string;
  onRequestService?: (service: CmsItem) => void;
  className: string;
  iconClassName?: string;
};

export function ServiceRequestAction({
  service,
  label,
  onRequestService,
  className,
  iconClassName = 'h-4 w-4',
}: ServiceRequestActionProps) {
  const content = (
    <>
      <CalendarCheck className={iconClassName} aria-hidden="true" />
      <span>{label}</span>
    </>
  );

  if (onRequestService) {
    return (
      <button
        type="button"
        onClick={() => onRequestService(service)}
        className={className}
        data-appointment-service-action
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={serviceBookingHref(service.id)}
      className={className}
      data-appointment-service-action
    >
      {content}
    </Link>
  );
}
