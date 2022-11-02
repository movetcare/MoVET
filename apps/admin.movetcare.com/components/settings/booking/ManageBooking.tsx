import { classNames } from 'utils/classNames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breadcrumbs from 'components/Breadcrumbs';
import GeneralSettings from './GeneralSettings';
import { subNavigation } from './SubNavigation';
const PAGE_NAME = subNavigation[0].name;
const ManageBooking = () => {
  return (
    <section className="flex flex-row items-center justify-center bg-white rounded-lg overflow-hidden">
      <div className="bg-white rounded-lg overflow-hidden w-full">
        <div className="px-8 my-4 w-full border-b pb-4 border-movet-gray">
          <Breadcrumbs
            pages={[
              { name: 'Settings', href: '/settings/', current: false },
              {
                name: 'Manage Booking',
                href: '/settings/booking/',
                current: true,
              },
            ]}
          />
        </div>
        <div className="divide-y divide-movet-gray lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x -mt-4">
          <aside className="lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.name === PAGE_NAME
                      ? 'bg-movet-red text-movet-white hover:bg-opacity-80 hover:text-movet-white'
                      : 'border-transparent text-movet-black hover:bg-movet-white hover:text-movet-black',
                    'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                  )}
                  aria-current={item.name === PAGE_NAME ? 'page' : undefined}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classNames(
                      item.name === PAGE_NAME
                        ? 'text-movet-white group-hover:text-movet-white'
                        : 'text-movet-black group-hover:text-movet-black',
                      'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </nav>
          </aside>
          <GeneralSettings />
        </div>
      </div>
    </section>
  );
};

export default ManageBooking;
