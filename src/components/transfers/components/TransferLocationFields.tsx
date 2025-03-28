
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransferFormValues } from "../schemas/transfer-form-schema";

interface TransferLocationFieldsProps {
  form: UseFormReturn<TransferFormValues>;
  warehouses: any[];
  posLocations: any[];
  transferType: "depot_to_pos" | "pos_to_depot" | "depot_to_depot";
}

export const TransferLocationFields = ({
  form,
  warehouses,
  posLocations,
  transferType,
}: TransferLocationFieldsProps) => {
  return (
    <>
      {(transferType === 'depot_to_pos' || transferType === 'depot_to_depot') && (
        <FormField
          control={form.control}
          name="source_warehouse_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dépôt source</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder="Sélectionnez le dépôt source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {transferType === 'pos_to_depot' && (
        <FormField
          control={form.control}
          name="source_pos_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Point de vente source</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder="Sélectionnez le point de vente source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {posLocations.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {(transferType === 'pos_to_depot' || transferType === 'depot_to_depot') && (
        <FormField
          control={form.control}
          name="destination_warehouse_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dépôt de destination</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder="Sélectionnez le dépôt de destination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem 
                      key={warehouse.id} 
                      value={warehouse.id}
                      disabled={transferType === 'depot_to_depot' && warehouse.id === form.watch('source_warehouse_id')}
                    >
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {transferType === 'depot_to_pos' && (
        <FormField
          control={form.control}
          name="destination_pos_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Point de vente de destination</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="glass-effect">
                    <SelectValue placeholder="Sélectionnez le point de vente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {posLocations.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
