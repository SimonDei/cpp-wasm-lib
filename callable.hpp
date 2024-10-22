#ifndef UNTITLED4_CALLABLE_HPP
#define UNTITLED4_CALLABLE_HPP

#include <functional>

template<typename EventType>
class callable {
private:
    std::function<int(int, const EventType*, void*)> func_;

public:
    callable(const callable&) = delete;
    callable& operator=(const callable&) = delete;

    template<typename Callable>
    explicit callable(Callable&& func) : func_(std::forward<Callable>(func)) {}

    int (*get_function_ptr(void** out_context))(int, const EventType*, void*) {
        *out_context = this;  // Set the context to `this` callable instance
        return trampoline;    // Return the trampoline function pointer
    }

    // Trampoline function pointer that can be passed to C-style APIs
    static int trampoline(int a, const EventType* b, void* c) {
        // The `void*` c contains the pointer to the callable instance
        auto* instance = static_cast<callable*>(c);
        if (instance->func_) {
            // Call the stored function on the specific instance
            return instance->func_(a, b, c);
        }
        return 0;  // Default return value if no function is set
    }
};

#endif
