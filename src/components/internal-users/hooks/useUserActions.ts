
import { supabase } from "@/integrations/supabase/client";
import { InternalUser } from "@/types/internal-user";
import { UserFormValues } from "../validation/user-form-schema";
import { toast } from "@/hooks/use-toast";

export const useUserActions = (fetchUsers: () => Promise<void>) => {
  
  const handleSubmit = async (values: UserFormValues, selectedUser: InternalUser | null): Promise<void> => {
    try {
      if (selectedUser) {
        // Update existing user
        const updateData: Partial<InternalUser> = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone || null,
          address: values.address || null,
          role: values.role,
          is_active: values.is_active || true,
          force_password_change: values.force_password_change,
        };

        const { error } = await supabase
          .from("internal_users")
          .update(updateData)
          .eq("id", selectedUser.id);

        if (error) throw error;

        // If password is provided, update it
        if (values.password && values.password.trim() !== "") {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            selectedUser.id,
            { 
              password: values.password,
              user_metadata: { force_password_change: values.force_password_change }
            }
          );

          if (passwordError) throw passwordError;
        }
      } else {
        // Create new user
        const { data: existingUsers, error: checkError } = await supabase
          .from("internal_users")
          .select("id")
          .eq("email", values.email);

        if (checkError) throw checkError;

        if (existingUsers && existingUsers.length > 0) {
          toast({
            title: "Erreur",
            description: "Un utilisateur avec cet email existe déjà",
            variant: "destructive",
          });
          return;
        }

        // Make sure password is provided for new users
        if (!values.password || values.password.trim() === "") {
          toast({
            title: "Erreur",
            description: "Le mot de passe est requis pour un nouvel utilisateur",
            variant: "destructive",
          });
          return;
        }

        // Create an auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: { force_password_change: values.force_password_change }
        });

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error("Échec de la création de l'utilisateur");
        }

        // Now create the internal user record
        const { error: insertError } = await supabase
          .from("internal_users")
          .insert({
            id: authData.user.id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone || null,
            address: values.address || null,
            role: values.role,
            is_active: true,
            force_password_change: values.force_password_change,
          });

        if (insertError) throw insertError;
      }

      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error submitting user:", error);
      throw error;
    }
  };

  const handleDelete = async (user: InternalUser) => {
    try {
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.first_name} ${user.last_name}?`)) {
        return;
      }

      const { error } = await supabase
        .from("internal_users")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Utilisateur supprimé",
        description: `${user.first_name} ${user.last_name} a été supprimé avec succès`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (user: InternalUser) => {
    try {
      const newStatus = !user.is_active;
      const { error } = await supabase
        .from("internal_users")
        .update({ is_active: newStatus })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `L'utilisateur est maintenant ${newStatus ? "actif" : "inactif"}`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  return {
    handleSubmit,
    handleDelete,
    toggleUserStatus
  };
};
