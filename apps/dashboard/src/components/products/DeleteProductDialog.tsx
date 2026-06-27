"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProductMutation } from "@/redux/api/productApi";

type DeleteProductDialogProps = {
  productId: string | null;
  productName: string;
  onClose: () => void;
};

export function DeleteProductDialog({
  productId,
  productName,
  onClose,
}: DeleteProductDialogProps) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!productId) return;
    try {
      await deleteProduct(productId).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <Dialog open={Boolean(productId)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-brand-charcoal">{productName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" size="md" loading={isLoading} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
