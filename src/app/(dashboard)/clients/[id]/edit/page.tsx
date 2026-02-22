'use client';

import { useEffect, useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Client } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

function EditClientContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [accessInfo, setAccessInfo] = useState('');
  const [keySafe, setKeySafe] = useState('');
  const [alarmCode, setAlarmCode] = useState('');
  const [pets, setPets] = useState('');
  const [preferences, setPreferences] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get<Client>(`/clients/${id}`),
  });

  useEffect(() => {
    if (!client) return;
    setName(client.name);
    setPhone(client.phone ?? '');
    setAddress(client.address ?? '');
    const n = client.notes;
    setAccessInfo(n?.accessInfo ?? '');
    setKeySafe(n?.keySafe ?? '');
    setAlarmCode(n?.alarmCode ?? '');
    setPets(n?.pets ?? '');
    setPreferences(n?.preferences ?? '');
  }, [client]);

  const hasNotes = !!(keySafe || alarmCode || accessInfo || pets || preferences);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const notes: Record<string, string> = {};
      if (accessInfo) notes.accessInfo = accessInfo;
      if (keySafe) notes.keySafe = keySafe;
      if (alarmCode) notes.alarmCode = alarmCode;
      if (pets) notes.pets = pets;
      if (preferences) notes.preferences = preferences;

      await api.put<Client>(`/clients/${id}`, {
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        notes: Object.keys(notes).length ? notes : undefined,
      });
      toast.success('Client updated');
      router.push(`/clients/${id}`);
      router.refresh();
    } catch {
      // api shows toast on error
    } finally {
      setLoading(false);
    }
  }

  if (isLoading || !client) {
    return (
      <div className="mx-auto max-w-lg space-y-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <Link href={`/clients/${id}`} className="text-sm text-zinc-600 hover:underline">
          ← Back to client
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit client</h1>
        <p className="text-zinc-600">Update contact and access details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client details</CardTitle>
          <CardDescription>Basic information and optional secure notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone (optional)</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Address (optional)</label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 High Street, London"
                  rows={2}
                />
              </div>
            </div>

            <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors',
                    hasNotes
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  )}
                >
                  <span>Secure notes</span>
                  <span className="text-zinc-500">
                    Key safe, alarm, access info, pets
                  </span>
                  {notesOpen ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="text-xs text-zinc-500">
                    Store access codes and special instructions securely
                  </p>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Key safe code</label>
                    <Input
                      value={keySafe}
                      onChange={(e) => setKeySafe(e.target.value)}
                      placeholder="e.g. 1234"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Alarm code</label>
                    <Input
                      value={alarmCode}
                      onChange={(e) => setAlarmCode(e.target.value)}
                      placeholder="e.g. 5678"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Access information</label>
                    <Input
                      value={accessInfo}
                      onChange={(e) => setAccessInfo(e.target.value)}
                      placeholder="e.g. Key under mat"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Pets</label>
                    <Input
                      value={pets}
                      onChange={(e) => setPets(e.target.value)}
                      placeholder="e.g. Friendly dog named Max"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Preferences</label>
                    <Textarea
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="e.g. Use eco-friendly products"
                      rows={2}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/clients/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditClientPage() {
  return (
    <RequireOwner>
      <EditClientContent />
    </RequireOwner>
  );
}
