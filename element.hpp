#ifndef UNTITLED4_ELEMENT_HPP
#define UNTITLED4_ELEMENT_HPP

#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/bind.h>

class element {
private:
    emscripten::val _ref{ emscripten::val::null() };

public:
    element() = delete;
    explicit element(emscripten::val ref)
        : _ref(ref) {}

    ~element() = default;

    explicit operator bool() const {
        return !_ref.isNull();
    }

    std::string text() const;
    void text(const std::string& text);

    void add_event_listener(const std::string& event_name, int (*)(int, const EmscriptenMouseEvent*, void*));
};

#endif
