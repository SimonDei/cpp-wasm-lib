#ifndef UNTITLED4_DOCUMENT_HPP
#define UNTITLED4_DOCUMENT_HPP

#include <string>

#include "element.hpp"

class document {
private:

public:
    document() = delete;
    ~document() = delete;

    static element query_selector(const std::string& selector);
};

#endif
