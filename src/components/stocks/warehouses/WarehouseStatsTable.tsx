
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  surface: number;
  capacity: number;
  manager: string;
  status: string;
  occupied: number;
}

interface WarehouseStatsTableProps {
  warehouses: Warehouse[];
  isLoading?: boolean;
  locationIcon?: React.ReactNode;
}

export function WarehouseStatsTable({ 
  warehouses, 
  isLoading = false,
  locationIcon = <Store className="h-4 w-4" />
}: WarehouseStatsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entrepôt</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Occupation</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Chargement des données...
              </TableCell>
            </TableRow>
          ) : warehouses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Aucun entrepôt trouvé
              </TableCell>
            </TableRow>
          ) : (
            warehouses.map((warehouse) => {
              const occupancyRate = (warehouse.occupied / warehouse.capacity) * 100;
              const isNearCapacity = occupancyRate >= 90;
              const isOverCapacity = occupancyRate > 100;

              return (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {locationIcon}
                      {warehouse.name}
                    </div>
                  </TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>{warehouse.surface} m²</TableCell>
                  <TableCell>{warehouse.capacity} unités</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {Math.round(occupancyRate)}% ({warehouse.occupied}/{warehouse.capacity})
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2.5">
                        <div 
                          className={cn(
                            "rounded-full h-2.5 transition-all duration-500",
                            {
                              'bg-gradient-to-r from-red-500 to-red-600': isOverCapacity,
                              'bg-gradient-to-r from-yellow-500 to-orange-500': isNearCapacity && !isOverCapacity,
                              'bg-gradient-to-r from-blue-500 to-purple-500': !isNearCapacity
                            }
                          )}
                          style={{ 
                            width: `${Math.min(occupancyRate, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{warehouse.manager}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={warehouse.status === 'Actif' ? 'default' : 'secondary'}
                      className={warehouse.status === 'Actif' ? 'bg-purple-600' : ''}
                    >
                      {warehouse.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
