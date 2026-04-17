export type MockUserRole = 'VOYAGEUR' | 'HOTE' | 'ADMIN';
export type MockUserStatus = 'ACTIF' | 'SUSPENDU' | 'BANNI';

export interface MockUserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: MockUserRole;
  phone: string | null;
  status: MockUserStatus;
  createdAt: string;
  updatedAt: string;
  reservations: number;
  source: 'seed' | 'api' | 'register' | 'local';
}

interface CreateMockUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: MockUserRole;
  phone?: string | null;
  avatar?: string | null;
  status?: MockUserStatus;
  reservations?: number;
  createdAt?: string;
  updatedAt?: string;
  source?: MockUserRecord['source'];
}

interface UpdateMockUserInput {
  role?: MockUserRole;
  status?: MockUserStatus;
  reservations?: number;
}

const STORAGE_KEY = 'hergoMockUsers';

const createDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const SEED_USERS: MockUserRecord[] = [
  {
    id: 1,
    firstName: 'Zeynab',
    lastName: 'Ba',
    email: 'zeynab@hergo.sn',
    avatar: 'https://i.pravatar.cc/80?u=zeynab@hergo.sn',
    role: 'VOYAGEUR',
    phone: '+221771112233',
    status: 'ACTIF',
    createdAt: createDate(18),
    updatedAt: createDate(18),
    reservations: 3,
    source: 'seed',
  },
  {
    id: 2,
    firstName: 'Aissatou',
    lastName: 'Fall',
    email: 'aissatou@hergo.sn',
    avatar: 'https://i.pravatar.cc/80?u=aissatou@hergo.sn',
    role: 'ADMIN',
    phone: '+221772223344',
    status: 'ACTIF',
    createdAt: createDate(42),
    updatedAt: createDate(42),
    reservations: 0,
    source: 'seed',
  },
  {
    id: 3,
    firstName: 'Moussa',
    lastName: 'Diallo',
    email: 'moussa@hergo.sn',
    avatar: 'https://i.pravatar.cc/80?u=moussa@hergo.sn',
    role: 'HOTE',
    phone: '+221773334455',
    status: 'ACTIF',
    createdAt: createDate(29),
    updatedAt: createDate(29),
    reservations: 7,
    source: 'seed',
  },
  {
    id: 4,
    firstName: 'Fatou',
    lastName: 'Seck',
    email: 'fatou@hergo.sn',
    avatar: 'https://i.pravatar.cc/80?u=fatou@hergo.sn',
    role: 'VOYAGEUR',
    phone: '+221774445566',
    status: 'SUSPENDU',
    createdAt: createDate(11),
    updatedAt: createDate(5),
    reservations: 1,
    source: 'seed',
  },
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readUsers = (): MockUserRecord[] => {
  if (!canUseStorage()) {
    return [...SEED_USERS];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
  }

  try {
    const users = JSON.parse(raw) as MockUserRecord[];
    return Array.isArray(users) && users.length > 0 ? users : [...SEED_USERS];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
  }
};

const writeUsers = (users: MockUserRecord[]) => {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const sortUsers = (users: MockUserRecord[]) =>
  [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

const nextId = (users: MockUserRecord[]) =>
  users.reduce((max, user) => Math.max(max, user.id), 0) + 1;

const parseName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { firstName: 'Utilisateur', lastName: '' };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(' '),
  };
};

const normalizeRole = (role: string): MockUserRole => {
  if (role === 'ADMIN' || role === 'Admin') {
    return 'ADMIN';
  }
  if (role === 'HOTE' || role === 'Hôte') {
    return 'HOTE';
  }
  return 'VOYAGEUR';
};

const normalizeStatus = (status?: string): MockUserStatus => {
  if (status === 'SUSPENDU' || status === 'suspendu') {
    return 'SUSPENDU';
  }
  if (status === 'BANNI' || status === 'banni') {
    return 'BANNI';
  }
  return 'ACTIF';
};

export const usersMockApi = {
  getAll(): MockUserRecord[] {
    return sortUsers(readUsers());
  },

  create(input: CreateMockUserInput): MockUserRecord {
    const users = readUsers();
    const now = new Date().toISOString();

    const newUser: MockUserRecord = {
      id: nextId(users),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      avatar: input.avatar ?? `https://i.pravatar.cc/80?u=${input.email.trim().toLowerCase()}`,
      role: input.role,
      phone: input.phone ?? null,
      status: input.status ?? 'ACTIF',
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
      reservations: input.reservations ?? 0,
      source: input.source ?? 'register',
    };

    const merged = sortUsers([newUser, ...users]);
    writeUsers(merged);
    return newUser;
  },

  upsert(user: Partial<MockUserRecord> & { email: string }): MockUserRecord {
    const users = readUsers();
    const email = user.email.trim().toLowerCase();
    const existing = users.find((item) => item.email.toLowerCase() === email);
    const now = new Date().toISOString();

    if (existing) {
      const updated: MockUserRecord = {
        ...existing,
        ...user,
        email,
        firstName: user.firstName ?? existing.firstName,
        lastName: user.lastName ?? existing.lastName,
        role: normalizeRole(user.role ?? existing.role),
        status: normalizeStatus(user.status ?? existing.status),
        avatar: user.avatar ?? existing.avatar,
        phone: user.phone ?? existing.phone,
        reservations: user.reservations ?? existing.reservations,
        updatedAt: now,
        source: user.source ?? existing.source,
      };

      writeUsers(sortUsers(users.map((item) => (item.id === existing.id ? updated : item))));
      return updated;
    }

    return this.create({
      firstName: user.firstName ?? parseName(email).firstName,
      lastName: user.lastName ?? parseName(email).lastName,
      email,
      role: normalizeRole(user.role ?? 'VOYAGEUR'),
      phone: user.phone ?? null,
      avatar: user.avatar ?? null,
      status: normalizeStatus(user.status),
      reservations: typeof user.reservations === 'number' ? user.reservations : 0,
      createdAt: typeof user.createdAt === 'string' ? user.createdAt : undefined,
      updatedAt: typeof user.updatedAt === 'string' ? user.updatedAt : undefined,
      source: user.source ?? 'local',
    });
  },

  seedFromApi(users: Array<{
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
    role?: string;
    phone?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  }>) {
    users.forEach((user) => {
      const firstName = typeof user.firstName === 'string' ? user.firstName : '';
      const lastName = typeof user.lastName === 'string' ? user.lastName : '';
      const email = typeof user.email === 'string' ? user.email : '';
      if (!email) {
        return;
      }

      this.upsert({
        id: typeof user.id === 'number' ? user.id : undefined,
        firstName,
        lastName,
        email,
        avatar: typeof user.avatar === 'string' ? user.avatar : null,
        role: normalizeRole(typeof user.role === 'string' ? user.role : 'VOYAGEUR'),
        phone: typeof user.phone === 'string' ? user.phone : null,
        status: normalizeStatus(typeof user.status === 'string' ? user.status : 'ACTIF'),
        createdAt: typeof user.createdAt === 'string' ? user.createdAt : undefined,
        updatedAt: typeof user.updatedAt === 'string' ? user.updatedAt : undefined,
        source: 'api',
      });
    });

    return this.getAll();
  },

  update(id: number, updates: UpdateMockUserInput): MockUserRecord | null {
    const users = readUsers();
    const target = users.find((user) => user.id === id);
    if (!target) {
      return null;
    }

    const updated: MockUserRecord = {
      ...target,
      role: updates.role ? normalizeRole(updates.role) : target.role,
      status: updates.status ? normalizeStatus(updates.status) : target.status,
      reservations: updates.reservations ?? target.reservations,
      updatedAt: new Date().toISOString(),
      source: 'local',
    };

    writeUsers(sortUsers(users.map((user) => (user.id === id ? updated : user))));
    return updated;
  },

  ensureRegisteredUser(input: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    phoneCountryCode?: string;
    phoneNationalNumber?: string;
  }) {
    const { firstName, lastName } = parseName(input.name);
    const combinedPhone = [input.phoneCountryCode, input.phoneNationalNumber]
      .filter(Boolean)
      .join('')
      .replace(/\s+/g, '');
    const normalizedPhone =
      input.phone ?? (combinedPhone || null);

    return this.upsert({
      firstName,
      lastName,
      email: input.email,
      role: normalizeRole(input.role),
      phone: normalizedPhone,
      source: 'register',
    });
  },

  syncAuthenticatedUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string | null;
    phone?: string | null;
    status?: string;
  }) {
    return this.upsert({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: normalizeRole(user.role),
      avatar: user.avatar ?? null,
      phone: user.phone ?? null,
      status: normalizeStatus(user.status ?? 'ACTIF'),
      source: 'api',
    });
  },
};
