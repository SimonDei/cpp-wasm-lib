cmake_minimum_required(VERSION 3.29)
project(untitled4)

set(CMAKE_CXX_STANDARD 14)

add_executable(untitled4 main.cpp
        document.cpp
        document.hpp
        element.cpp
        element.hpp
        callable.hpp)

set_target_properties(untitled4 PROPERTIES LINK_FLAGS "--bind")
