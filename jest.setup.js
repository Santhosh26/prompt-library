// In jest.setup.js
jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
    }),
    useParams: jest.fn().mockReturnValue({}),
    usePathname: jest.fn().mockReturnValue(''),
    redirect: jest.fn(),  // Add this line
  }));