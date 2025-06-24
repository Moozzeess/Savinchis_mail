"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

/**
 * Esquema de validación para las opciones de una pregunta.
 */
const optionSchema = z.object({
  value: z.string().min(1, "La opción no puede estar vacía."),
});

/**
 * Esquema de validación para una pregunta.
 */
const questionSchema = z.object({
  text: z.string().min(1, "El texto de la pregunta es requerido."),
  type: z.enum(["text", "textarea", "multiple-choice", "checkboxes"]),
  options: z.array(optionSchema).optional(),
});

/**
 * Esquema de validación para el formulario de la encuesta.
 */
const surveyFormSchema = z.object({
  title: z.string().min(1, "El título de la encuesta es requerido."),
  description: z.string().optional(),
  questions: z.array(questionSchema),
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

/**
 * Componente del editor de encuestas.
 * Permite crear y configurar una encuesta con preguntas dinámicas.
 */
export function SurveyEditor() {
  const { toast } = useToast();

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          text: "",
          type: "text",
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  /**
   * Gestiona el envío del formulario.
   * Por ahora, solo muestra los datos en la consola y una notificación.
   * @param data - Los datos del formulario de la encuesta.
   */
  function onSubmit(data: SurveyFormValues) {
    console.log("Datos de la encuesta:", data);
    toast({
      title: "Encuesta Guardada",
      description: "Tu encuesta ha sido guardada con éxito.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Encuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Encuesta de Satisfacción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el propósito de tu encuesta..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preguntas</CardTitle>
            <CardDescription>
              Añade y configura las preguntas para tu encuesta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 relative">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pregunta {index + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="Escribe tu pregunta aquí..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pregunta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Respuesta corta</SelectItem>
                            <SelectItem value="textarea">Párrafo</SelectItem>
                            <SelectItem value="multiple-choice">Opción múltiple</SelectItem>
                            <SelectItem value="checkboxes">Casillas de verificación</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch(`questions.${index}.type`) === "multiple-choice" ||
                    form.watch(`questions.${index}.type`) === "checkboxes") && (
                    <OptionsArray control={form.control} nestIndex={index} />
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ text: "", type: "text", options: [] })}
            >
              Añadir Pregunta
            </Button>
          </CardContent>
        </Card>

        <Button type="submit">Guardar Encuesta</Button>
      </form>
    </Form>
  );
}

/**
 * Componente para gestionar las opciones de una pregunta de opción múltiple o casillas.
 * @param {object} props - Propiedades del componente.
 * @param {any} props.control - El control del formulario de react-hook-form.
 * @param {number} props.nestIndex - El índice de la pregunta padre.
 */
function OptionsArray({ control, nestIndex }: { control: any; nestIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions[${nestIndex}].options`,
  });

  return (
    <div className="space-y-2">
      <Label>Opciones</Label>
      {fields.map((item, k) => (
        <div key={item.id} className="flex items-center gap-2">
          <FormField
            control={control}
            name={`questions[${nestIndex}].options[${k}].value`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input {...field} placeholder={`Opción ${k + 1}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(k)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append({ value: "" })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Añadir Opción
      </Button>
    </div>
  );
}
