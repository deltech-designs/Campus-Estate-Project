import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesService } from '@/services/properties.service';
import type { ICreatePropertyPayload } from '@ems/shared';

const QUERY_KEY = ['properties'] as const;

export function useProperties() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: propertiesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ICreatePropertyPayload) => propertiesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => propertiesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    properties:  query.data ?? [],
    isLoading:   query.isLoading,
    error:       query.error instanceof Error ? query.error.message : null,
    refetch:     query.refetch,
    create:      createMutation.mutateAsync,
    remove:      removeMutation.mutateAsync,
    isCreating:  createMutation.isPending,
    isRemoving:  removeMutation.isPending,
  };
}
