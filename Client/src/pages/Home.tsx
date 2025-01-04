import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addTodo, deleteTodo, fetchTodos, toggleTodo } from '@/store/Todo-Slice';
import { logout } from '@/store/Auth-Slice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


export default function Home() {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const [newTodoDescription, setNewTodoDescription] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { todos, status, error } = useAppSelector((state) => state.todos);
  const { isLoading, user } = useAppSelector((state) => state.auth) as { isLoading: boolean, user: { id: string } | null };
  const { toast } = useToast();

  React.useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      dispatch(addTodo({
        title: newTodoTitle,
        description: newTodoDescription,
        completed: false,
        user: user?.id || ''
      })).then(()=>{
        toast({
          title: "Todo Added",
          description: "Your new todo has been added successfully.",
        });
      });
      setNewTodoTitle('');
      setNewTodoDescription('');
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id)).then(()=>{
      toast({
        title: "Todo Deleted",
        description: "Your todo has been deleted successfully.",
      });
    });
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id)).then(()=>{
      toast({
        title: "Todo Updated",
        description: "Your todo has been updated successfully.",
      });
    });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div>
                <Input
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Enter todo title..."
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  placeholder="Enter todo description..."
                  className="w-full"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Add Todo</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {status === 'loading' ? (
            <Card>
              <CardContent className="p-4">Loading...</CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => handleToggle(todo._id)}
                        />
                        <span className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(todo._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {todo.description && (
                      <p className={`ml-8 text-sm text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}